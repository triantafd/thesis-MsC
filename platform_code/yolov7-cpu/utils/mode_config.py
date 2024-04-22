def get_model_config(category):
    """
    Returns the path to the weights file of the classification model (e.g carpet/mirror), the number of output nodes, and labels based on the given category.

    :param category: The category for which the model configuration is needed.
    :return: A tuple containing the weights file path, the number of output nodes, and labels.
    """
    model_config = {
        'carpet': ('thesis_code/weights_classification_networks/best_model_carpet_weights.pth', 2, ['bad_carpet', 'good_carpet']),
        'mirror': ('thesis_code/weights_classification_networks/best_model_mirror_weights.pth', 3, ['bad_mirror', 'good_mirror']),
        # Add other categories with their corresponding configurations here
    }

    return model_config.get(category, ('weights_classification_networks/best_model_carpet_weights.pth', 1, ['carpet']))  # Default configuration